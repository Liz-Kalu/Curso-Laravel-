import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CDMMWMt2.js";
import { Link, useForm, usePage, Head } from "@inertiajs/react";
import { useState, createContext, useContext } from "react";
import { Transition } from "@headlessui/react";
import { route } from "ziggy-js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as PrimaryButton } from "./PrimaryButton-ydvV9yvf.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import "./ApplicationLogo-xMpxFOcX.js";
const DropDownContext = createContext();
const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };
  return /* @__PURE__ */ jsx(DropDownContext.Provider, { value: { open, setOpen, toggleOpen }, children: /* @__PURE__ */ jsx("div", { className: "relative", children }) });
};
const Trigger = ({ children }) => {
  const { open, setOpen, toggleOpen } = useContext(DropDownContext);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { onClick: toggleOpen, children }),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40",
        onClick: () => setOpen(false)
      }
    )
  ] });
};
const Content = ({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-white",
  children
}) => {
  const { open, setOpen } = useContext(DropDownContext);
  let alignmentClasses = "origin-top";
  if (align === "left") {
    alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
  } else if (align === "right") {
    alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
  }
  let widthClasses = "";
  if (width === "48") {
    widthClasses = "w-48";
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Transition,
    {
      show: open,
      enter: "transition ease-out duration-200",
      enterFrom: "opacity-0 scale-95",
      enterTo: "opacity-100 scale-100",
      leave: "transition ease-in duration-75",
      leaveFrom: "opacity-100 scale-100",
      leaveTo: "opacity-0 scale-95",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`,
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses,
              children
            }
          )
        }
      )
    }
  ) });
};
const DropdownLink = ({ className = "", children, ...props }) => {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none " + className,
      children
    }
  );
};
const DropdownButton = ({ className = "", children, ...props }) => {
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      className: "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none " + className,
      children
    }
  );
};
Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
Dropdown.Button = DropdownButton;
function ChirpForm({ chirp, className, setEditing }) {
  const { data, setData, post, patch, reset, errors, processing } = useForm({
    message: chirp == null ? void 0 : chirp.message
  });
  function update(id) {
    patch(route("chirps.update", id), {
      onSuccess: () => {
        setEditing(false);
      }
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (chirp == null ? void 0 : chirp.id) {
      update(chirp.id);
      return;
    }
    post(route("chirps.store"), {
      onSuccess: () => reset()
    });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className, children: [
    /* @__PURE__ */ jsx(
      "textarea",
      {
        placeholder: "What's on your mind?",
        className: " block w-full rounded-md border-gray-300 bg-white text-gray-800",
        value: data.message,
        onChange: (e) => setData("message", e.target.value)
      }
    ),
    /* @__PURE__ */ jsx(InputError, { message: errors.message }),
    /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, className: "mt-2", children: processing ? "Enviando...." : "Chirps" }),
    /* @__PURE__ */ jsx(
      SecondaryButton,
      {
        type: "button",
        onClick: () => setEditing(false),
        className: "ml-2",
        children: "Cancel"
      }
    )
  ] });
}
function ChirpItem({ chirp }) {
  const [editing, setEditing] = useState(false);
  const { auth } = usePage().props;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start p-6", children: [
    /* @__PURE__ */ jsx(
      "svg",
      {
        className: "h-6 w-6 text-gray-600 dark:text-gray-400",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M7 8h10M7 12h6m-9 8l2.5-3H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-5 3z"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "ml-3 flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-gray-600", children: chirp.user.name }),
        /* @__PURE__ */ jsx("small", { className: "ml-2 text-sm text-gray-600 dark:text-gray-400", children: chirp.createdAt }),
        chirp.edited && /* @__PURE__ */ jsx("small", { className: "ml-1 text-sm text-gray-600 dark:text-gray-400", children: "· edited" })
      ] }),
      editing ? /* @__PURE__ */ jsx(
        ChirpForm,
        {
          chirp,
          className: "mt-2",
          setEditing
        }
      ) : /* @__PURE__ */ jsx("p", { className: "mt-1 text-lg text-gray-900 dark:text-gray-500", children: chirp.message })
    ] }),
    chirp.user.id === auth.user.id && /* @__PURE__ */ jsxs(Dropdown, { children: [
      /* @__PURE__ */ jsx(Dropdown.Trigger, { children: /* @__PURE__ */ jsx("button", { className: "ml-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700", children: /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "currentColor",
          viewBox: "0 0 20 20",
          className: "h-5 w-5",
          children: /* @__PURE__ */ jsx("path", { d: "M3 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" })
        }
      ) }) }),
      /* @__PURE__ */ jsxs(Dropdown.Content, { children: [
        /* @__PURE__ */ jsx(Dropdown.Button, { onClick: () => setEditing(true), children: "Edit" }),
        /* @__PURE__ */ jsx(
          Dropdown.Link,
          {
            as: "button",
            href: route("chirps.destroy", chirp.id),
            method: "delete",
            children: "Delete"
          }
        )
      ] })
    ] })
  ] });
}
function Index({ auth, chirps }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Chirps" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Chirps", children: /* @__PURE__ */ jsx("meta", { name: "description", content: "Chirps description" }) }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900", children: /* @__PURE__ */ jsx(ChirpForm, {}) }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 bg-white shadow-md rounded-lg divide-y divide-gray-200", children: chirps.map((chirp) => /* @__PURE__ */ jsx(ChirpItem, { chirp }, `chirps-${chirp.id}`)) })
        ] }) })
      ]
    }
  );
}
export {
  Index as default
};
