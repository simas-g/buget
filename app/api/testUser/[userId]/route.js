import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const GET = async (req, { params }) => {
  try {
    const { userId } = await params;
    
    const testDataDir = join(process.cwd(), "app", "lib", "testData");
    
    const usersData = JSON.parse(
      readFileSync(join(testDataDir, "testUsers.json"), "utf-8")
    );
    const transactionsData = JSON.parse(
      readFileSync(join(testDataDir, "testTransactions.json"), "utf-8")
    );
    const bankConnectionsData = JSON.parse(
      readFileSync(join(testDataDir, "testBankConnections.json"), "utf-8")
    );
    const monthSummariesData = JSON.parse(
      readFileSync(join(testDataDir, "testMonthSummaries.json"), "utf-8")
    );

    const selectedUser = usersData.testUsers.find(u => u.userId === userId);
    
    if (!selectedUser) {
      return NextResponse.json(
        { message: "Test user not found" },
        { status: 404 }
      );
    }

    const userData = {
      user: selectedUser,
      transactions: transactionsData[userId] || [],
      bankConnections: bankConnectionsData[userId] || [],
      monthSummaries: monthSummariesData[userId] || [],
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error loading test user data:", error);
    return NextResponse.json(
      { message: "Failed to load test user" },
      { status: 500 }
    );
  }
};

