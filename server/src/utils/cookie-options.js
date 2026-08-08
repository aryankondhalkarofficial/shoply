const NODE_ENV = process.env.NODE_ENV;

const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export default cookieOptions;
