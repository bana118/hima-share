import { loginWithGoogle } from "utils/auth-provider";

export const GoogleLoginButton = (): JSX.Element => {
  return (
    <input
      type="image"
      src="/btn_google_signin_light_normal_web.png"
      alt="Login with Google"
      onClick={loginWithGoogle}
      onMouseOver={(event) =>
        (event.currentTarget.src = "/btn_google_signin_light_focus_web.png")
      }
      onMouseOut={(event) =>
        (event.currentTarget.src = "/btn_google_signin_light_normal_web.png")
      }
    />
  );
};
