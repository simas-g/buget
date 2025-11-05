import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const GET = async () => {
  try {
    const testDataDir = join(process.cwd(), "app", "lib", "testData");
    
    const usersData = JSON.parse(
      readFileSync(join(testDataDir, "testUsers.json"), "utf-8")
    );

    return NextResponse.json({ testUsers: usersData.testUsers }, { status: 200 });
  } catch (error) {
    console.error("Error loading test users:", error);
    return NextResponse.json(
      { message: "Failed to load test users" },
      { status: 500 }
    );
  }
};

