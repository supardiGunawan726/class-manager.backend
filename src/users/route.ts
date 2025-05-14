import { auth, db } from "../firebase";

export async function POST(request: Request){
  try {
    const user = await request.json();
    const userRecord = await auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.name,
    });
    await db
      .collection("users")
      .doc(userRecord.uid)
      .set(
        JSON.parse(
          JSON.stringify({
            name: user.name,
            nim: user.nim,
            class_id: user.class_id,
          })
        ),
        { merge: true }
      );
    return Response.json({
      uid: userRecord.uid,
      ...user,
    }, { status: 200})
  } catch (error: any) {
    return Response.json({
      message: error.message
    }, { status: 500 })
  }
}