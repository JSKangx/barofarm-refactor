import { MongoClient } from "mongodb";

async function testConnection() {
  try {
    // 연결 문자열 그대로 사용
    const client = await MongoClient.connect("mongodb://final04:final04!!@db.fesp.shop:27017/?authSource=final04");
    console.log("MongoDB 연결 성공!");

    // 데이터베이스 접근
    const db = client.db("final04");

    // 컬렉션 접근 및 간단한 쿼리 실행
    const count = await db.collection("user").countDocuments();
    console.log("user 컬렉션의 문서 수:", count);

    await client.close();
    console.log("연결 종료");
  } catch (error) {
    console.error("MongoDB 연결 오류: ", error);
  }
}

testConnection();
