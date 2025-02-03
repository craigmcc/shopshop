//"use client"; // Only for when using toast()

// @/app/(auth)/lists/page.tsx

/**
 * Enumerate the actions that can be taken to manage shopping lists.
 * Successful sign ins will be redirected to this page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

//import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export default function ListsPage() {

/*
  toast.dismiss()
  toast.error("error", {position: "bottom-right", autoClose: false, theme: "colored"});
  toast.info("info", {position: "bottom-right", autoClose: false, theme: "colored"});
  toast.success("success", {position: "bottom-right", autoClose: false, theme: "colored"});
  toast.warning("warning", {position: "bottom-right", autoClose: false, theme: "colored"});
*/

  return (
    <div className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh gap-6">
      <h1 className="text-5xl">Shopping List Management</h1>
      <div>Select one of the following options:</div>
      <ul>
        <li>Click on the &apos;plus&apos; icon to add a new list. </li>
        <li>Click on the name of a list to enter items on that list.</li>
        <li>Click on the &apos;...&apos; icon to open a menu of available options.</li>
      </ul>
      <div className="justify-center">DaisyUI Theme Colors</div>
      <div className="flex flex-row gap-2">
        <button className="btn btn-accent">
          <span className="accent-content">Accent</span>
        </button>
        <button className="btn btn-error">
          <span className="error-content">Error</span>
        </button>
        <button className="btn btn-info">
          <span className="info-content">Info</span>
        </button>
        <button className="btn btn-primary">
          <span className="neutral-content">Neutral</span>
        </button>
        <button className="btn btn-primary">
          <span className="primary-content">Primary</span>
        </button>
        <button className="btn btn-success">
          <span className="success-content">Success</span>
        </button>
        <button className="btn btn-warning">
          <span className="warning-content">Warning</span>
        </button>
      </div>
{/*
      <div className="justify-center">React-Toastify Theme Colors</div>
      <div className="flex flex-row justify-center gap-2">
        <button className="btn toastify-color-error">
          <span className="toastify-text-color-error">Error</span>
        </button>
        <button className="btn toastify-color-info">
          <span className="toastify-text-color-info">Info</span>
        </button>
        <button className="btn toastify-color-success">
          <span className="toastify-text-color-success">Success</span>
        </button>
        <button className="btn toastify-color-warning">
          <span className="toastify-text-color-warning">Warning</span>
        </button>
      </div>
*/}
    </div>
  )
}
