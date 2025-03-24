if (missingStudies.length > 0) {
      await db.study.createMany({
        data: missingStudies
      });
    }