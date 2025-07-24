// app/api/invoices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 

const prisma = new PrismaClient();

interface InvoiceRequest {
  invoiceNumber: string;
  billingMonth: string;
  startDate: string;
  invoiceDate: string;
  totalAmount: number;
  caseIds: string[]; // Array of case IDs to associate with this invoice
  taxAmount?: number;
  clientAddress?: string;
  clientGSTIN?: string;
  clientTAN?: string;
  hospitalId: string; // Required for hospital-specific invoices
}

// Helper function to get hospital ID from session
async function getHospitalIdFromSession(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Get the user and check if they are a hospital user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || user.userType !== 'HOSPITAL') {
    return null;
  }

  // Option 1: If you have a direct hospitalId field in User model (you'll need to add this)
  // return user.hospitalId;

  // Option 2: If you have a HospitalUser junction table (please share the complete schema)
  // const hospitalUser = await prisma.hospitalUser.findFirst({
  //   where: { userId: session.user.id },
  //   include: { hospital: true }
  // });
  // return hospitalUser?.hospitalId || null;

  // Option 3: If hospital users are identified by email/username matching
  const hospital = await prisma.hospital.findFirst({
    where: { 
      email: user.email 
    }
  });

  return hospital?.id || null;
}

// Helper function to validate hospital access
async function validateHospitalAccess(hospitalId: string, userHospitalId: string) {
  return hospitalId === userHospitalId;
}

export async function POST(request: NextRequest) {
  try {
    const body: InvoiceRequest = await request.json();
    
    // Get hospital ID from session
    const userHospitalId = await getHospitalIdFromSession(request);
    if (!userHospitalId) {
      return NextResponse.json(
        { error: 'Unauthorized: No hospital association found' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!body.invoiceNumber || !body.billingMonth || !body.totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: invoiceNumber, billingMonth, or totalAmount' },
        { status: 400 }
      );
    }

    // Ensure hospitalId matches the logged-in user's hospital
    if (body.hospitalId && body.hospitalId !== userHospitalId) {
      return NextResponse.json(
        { error: 'Unauthorized: Cannot create invoice for another hospital' },
        { status: 403 }
      );
    }

    // Use the user's hospital ID
    const hospitalId = userHospitalId;

    // Check if invoice already exists for this hospital
    const existingInvoice = await prisma.invoice.findFirst({
      where: { 
        invoiceNumber: body.invoiceNumber,
        hospitalId: hospitalId
      }
    });

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice with this number already exists for your hospital' },
        { status: 409 }
      );
    }

    // Validate that all case IDs belong to the hospital
    if (body.caseIds && body.caseIds.length > 0) {
      const caseCount = await prisma.case.count({
        where: {
          id: { in: body.caseIds },
          hospitalId: hospitalId
        }
      });

      if (caseCount !== body.caseIds.length) {
        return NextResponse.json(
          { error: 'Some cases do not belong to your hospital' },
          { status: 403 }
        );
      }
    }

    // Parse dates
    const startDate = new Date(body.startDate);
    const invoiceDate = body.invoiceDate ? new Date(body.invoiceDate) : new Date();

    // Create new invoice record
    const createdInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber: body.invoiceNumber,
        billingMonth: body.billingMonth,
        startDate: startDate,
        invoiceDate: invoiceDate,
        totalAmount: body.totalAmount,
        taxAmount: body.taxAmount || 0,
        clientAddress: body.clientAddress,
        clientGSTIN: body.clientGSTIN || "NO",
        clientTAN: body.clientTAN || "Unregistered",
        hospitalId: hospitalId,
      },
      include: {
        hospital: true,
        cases: {
          include: {
            studies: true,
            priceItems: true,
          }
        }
      }
    });

    // Update cases to link them to this invoice
    if (body.caseIds && body.caseIds.length > 0) {
      await prisma.case.updateMany({
        where: {
          id: { in: body.caseIds },
          hospitalId: hospitalId // Additional security check
        },
        data: {
          invoiceId: createdInvoice.id,
          billingMonth: body.billingMonth
        }
      });
    }

    // Fetch the complete invoice with updated cases
    const invoiceWithCases = await prisma.invoice.findUnique({
      where: { id: createdInvoice.id },
      include: {
        hospital: true,
        cases: {
          include: {
            studies: true,
            priceItems: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice: invoiceWithCases,
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get hospital ID from session
    const userHospitalId = await getHospitalIdFromSession(request);
    if (!userHospitalId) {
      return NextResponse.json(
        { error: 'Unauthorized: No hospital association found' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const billingMonth = searchParams.get('billingMonth');
    const invoiceNumber = searchParams.get('invoiceNumber');
    const invoiceId = searchParams.get('id');

    let invoices;
    
    if (invoiceId) {
      // Get specific invoice by ID (only if it belongs to user's hospital)
      invoices = await prisma.invoice.findFirst({
        where: { 
          id: invoiceId,
          hospitalId: userHospitalId
        },
        include: {
          hospital: true,
          cases: {
            include: {
              studies: true,
              priceItems: true,
            }
          }
        }
      });
      
      if (!invoices) {
        return NextResponse.json(
          { error: 'Invoice not found or access denied' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        invoice: invoices,
      });
    } else if (invoiceNumber) {
      // Get invoice by invoice number (only if it belongs to user's hospital)
      invoices = await prisma.invoice.findFirst({
        where: { 
          invoiceNumber: invoiceNumber,
          hospitalId: userHospitalId
        },
        include: {
          hospital: true,
          cases: {
            include: {
              studies: true,
              priceItems: true,
            }
          }
        }
      });
      
      if (!invoices) {
        return NextResponse.json(
          { error: 'Invoice not found or access denied' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        invoice: invoices,
      });
    } else if (billingMonth) {
      // Get invoices by billing month (only for user's hospital)
      invoices = await prisma.invoice.findMany({
        where: { 
          billingMonth: billingMonth,
          hospitalId: userHospitalId
        },
        include: {
          hospital: true,
          cases: {
            include: {
              studies: true,
              priceItems: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Get all invoices (only for user's hospital)
      invoices = await prisma.invoice.findMany({
        where: {
          hospitalId: userHospitalId
        },
        include: {
          hospital: true,
          cases: {
            include: {
              studies: true,
              priceItems: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({
      success: true,
      invoices: Array.isArray(invoices) ? invoices : [invoices].filter(Boolean),
      count: Array.isArray(invoices) ? invoices.length : (invoices ? 1 : 0),
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get hospital ID from session
    const userHospitalId = await getHospitalIdFromSession(request);
    if (!userHospitalId) {
      return NextResponse.json(
        { error: 'Unauthorized: No hospital association found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, caseIds, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required for update' },
        { status: 400 }
      );
    }

    // Verify that the invoice belongs to the user's hospital
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: id,
        hospitalId: userHospitalId
      }
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found or access denied' },
        { status: 404 }
      );
    }

    // Validate that all case IDs belong to the hospital
    if (caseIds && Array.isArray(caseIds)) {
      const caseCount = await prisma.case.count({
        where: {
          id: { in: caseIds },
          hospitalId: userHospitalId
        }
      });

      if (caseCount !== caseIds.length) {
        return NextResponse.json(
          { error: 'Some cases do not belong to your hospital' },
          { status: 403 }
        );
      }
    }

    // Parse dates if they exist
    const dataToUpdate: any = { ...updateData };
    if (updateData.startDate) {
      dataToUpdate.startDate = new Date(updateData.startDate);
    }
    if (updateData.invoiceDate) {
      dataToUpdate.invoiceDate = new Date(updateData.invoiceDate);
    }

    // Update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: id },
      data: dataToUpdate,
    });

    // Update case associations if provided
    if (caseIds && Array.isArray(caseIds)) {
      // First, remove invoice association from cases not in the list (only from user's hospital)
      await prisma.case.updateMany({
        where: {
          invoiceId: id,
          hospitalId: userHospitalId,
          id: { notIn: caseIds }
        },
        data: {
          invoiceId: null,
          billingMonth: null
        }
      });

      // Then, add invoice association to cases in the list (only from user's hospital)
      await prisma.case.updateMany({
        where: {
          id: { in: caseIds },
          hospitalId: userHospitalId
        },
        data: {
          invoiceId: id,
          billingMonth: updatedInvoice.billingMonth
        }
      });
    }

    // Fetch updated invoice with cases
    const invoiceWithCases = await prisma.invoice.findUnique({
      where: { id: id },
      include: {
        hospital: true,
        cases: {
          include: {
            studies: true,
            priceItems: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice: invoiceWithCases,
    });

  } catch (error) {
    console.error('Error updating invoice:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get hospital ID from session
    const userHospitalId = await getHospitalIdFromSession(request);
    if (!userHospitalId) {
      return NextResponse.json(
        { error: 'Unauthorized: No hospital association found' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required for deletion' },
        { status: 400 }
      );
    }

    // Verify that the invoice belongs to the user's hospital
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: id,
        hospitalId: userHospitalId
      }
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found or access denied' },
        { status: 404 }
      );
    }

    // First, unlink all cases from this invoice (only from user's hospital)
    await prisma.case.updateMany({
      where: { 
        invoiceId: id,
        hospitalId: userHospitalId
      },
      data: {
        invoiceId: null,
        billingMonth: null
      }
    });

    // Then delete the invoice
    await prisma.invoice.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting invoice:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}