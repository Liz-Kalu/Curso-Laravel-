import { jsxs, jsx } from "react/jsx-runtime";
import { route } from "ziggy-js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as PrimaryButton } from "./PrimaryButton-ydvV9yvf.js";
import { I as InputLabel, T as TextInput } from "./TextInput-CR1BZKVc.js";
import { G as GuestLayout } from "./GuestLayout-B-R2jca9.js";
import { useForm, Head } from "@inertiajs/react";
import { _ as __ } from "./useTranslation-CAoJJV1z.js";
import "react";
import "./ApplicationLogo-xMpxFOcX.js";
function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: __("Forgot Password") }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-gray-600", children: __(`Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.`) }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600", children: status }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsx(InputLabel, { for: "email", value: __("Email") }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          id: "email",
          type: "email",
          name: "email",
          value: data.email,
          className: "mt-1 block w-full",
          isFocused: true,
          onChange: (e) => setData("email", e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex items-center justify-end", children: /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: __("Email Password Reset Link") }) })
    ] })
  ] });
}
export {
  ForgotPassword as default
};
