import { Router } from "express";
import { auth, db } from "../firebase";

const userController = Router({ mergeParams: true });
userController.post("/", async (req, res) => {
  try {
    const user = req.body;
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
    res.status(200).json({
      uid: userRecord.uid,
      ...user,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message ?? "server error",
    });
    return Promise.reject(error);
  }
});

export default userController;
