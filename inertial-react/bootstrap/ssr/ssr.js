import { jsx } from "react/jsx-runtime";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Laravel";
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.jsx`,
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-T4Jfui-a.js"), "./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-pUSn9MyQ.js"), "./Pages/Auth/Login.jsx": () => import("./assets/Login-BgMjbDLB.js"), "./Pages/Auth/Register.jsx": () => import("./assets/Register-hHf6U8X1.js"), "./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-Df_ImzU5.js"), "./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-DBnKo6J_.js"), "./Pages/Chirps/Index.jsx": () => import("./assets/Index-Dgsgds1a.js"), "./Pages/Dashboard.jsx": () => import("./assets/Dashboard-CbpiqLSl.js"), "./Pages/Profile/Edit.jsx": () => import("./assets/Edit-DdSRxK39.js"), "./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-CGyQct8Y.js"), "./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-CQ0LYKvF.js"), "./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-CJHuQkoY.js"), "./Pages/Welcome.jsx": () => import("./assets/Welcome-ZNqnaZRd.js") })
    ),
    setup: ({ App, props }) => {
      global.Ziggy = props.initialPage.props.ziggy;
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);
