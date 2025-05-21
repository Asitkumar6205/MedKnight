import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Params = { id: string };

// POST /api/cases/[id]/lock
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const caseId = params.id;
    const userId = session.user.id;

    // Check if case exists and is not already locked
    const existingCase = await db.case.findUnique({
      where: { id: caseId },
      include: { lockedByUser: true }
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (existingCase.isLocked) {
      // Check if lock has expired (optional feature)
      const now = new Date();
      if (existingCase.lockExpiry && now > existingCase.lockExpiry) {
        // Lock has expired, remove it
        await db.case.update({
          where: { id: caseId },
          data: {
            isLocked: false,
            lockedBy: null,
            lockedAt: null,
            lockExpiry: null
          }
        });
      } else {
        return NextResponse.json({
          error: 'Case is already locked',
          lockedBy: existingCase.lockedByUser?.username || 'Another user',
          lockedAt: existingCase.lockedAt
        }, { status: 409 });
      }
    }

    // Lock the case
    const lockExpiry = new Date();
    lockExpiry.setHours(lockExpiry.getHours() + 2); // 2-hour lock expiry

    const updatedCase = await db.case.update({
      where: { id: caseId },
      data: {
        isLocked: true,
        lockedBy: userId,
        lockedAt: new Date(),
        lockExpiry: lockExpiry
      },
      include: { lockedByUser: true }
    });

    return NextResponse.json({
      success: true,
      case: updatedCase,
      message: 'Case locked successfully'
    });

  } catch (error) {
    console.error('Error locking case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cases/[id]/lock
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const caseId = params.id;
    const userId = session.user.id;

    // Check if case exists and is locked by the current user
    const existingCase = await db.case.findUnique({
      where: { id: caseId }
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (!existingCase.isLocked) {
      return NextResponse.json({ error: 'Case is not locked' }, { status: 400 });
    }

    if (existingCase.lockedBy !== userId) {
      return NextResponse.json(
        { error: 'You can only unlock cases you have locked' },
        { status: 403 }
      );
    }

    // Unlock the case
    const updatedCase = await db.case.update({
      where: { id: caseId },
      data: {
        isLocked: false,
        lockedBy: null,
        lockedAt: null,
        lockExpiry: null
      }
    });

    return NextResponse.json({
      success: true,
      case: updatedCase,
      message: 'Case unlocked successfully'
    });

  } catch (error) {
    console.error('Error unlocking case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}