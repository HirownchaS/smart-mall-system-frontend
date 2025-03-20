import React from "react";
import { FcCalendar } from "react-icons/fc";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { convertToIST } from "../../pages/CalenderIndex";

const Modal = ({ isOpen, setIsOpen, event }) => {
  return (
    <div
      className={`relative z-10 ${!isOpen && "hidden"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <FcCalendar className="size-10" />
                </div>
                <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left space-y-2">
                  <div
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-5"
                    id="modal-title"
                  >
                    {event?.Subject}
                  </div>

                  {event?.Location && (
                    <div className="w-full flex flex-wrap justify-between items-center text-xs">
                      <div className="font-semibold">Location</div>
                      <div className="text-[#00000088] dark:text-[#ffffff88] group-hover:text-[#ffffff88] capitalize flex justify-center items-center gap-1">
                        <FaLocationDot /> <div>{event?.Location}</div>
                      </div>
                    </div>
                  )}

                  <div className="w-full flex flex-wrap justify-between items-center text-xs">
                    <div className="font-semibold">Start Time</div>
                    <div className="text-[#00000088] dark:text-[#ffffff88] group-hover:text-[#ffffff88] flex justify-center items-center gap-1">
                      <div>
                        {event?.StartTime && convertToIST(event?.StartTime)}
                      </div>
                      <MdOutlineAccessTimeFilled />
                    </div>
                  </div>

                  <div className="w-full flex flex-wrap justify-between items-center text-xs">
                    <div className="font-semibold">End Time</div>
                    <div className="text-[#00000088] dark:text-[#ffffff88] group-hover:text-[#ffffff88] flex justify-center items-center gap-1">
                      <div>
                        {event?.EndTime && convertToIST(event?.EndTime)}
                      </div>
                      <MdOutlineAccessTimeFilled />{" "}
                    </div>
                  </div>

                  <div className="w-full flex flex-wrap justify-between items-center text-xs">
                    <div className="font-semibold">Is All Day</div>
                    <div className="text-[#00000088] dark:text-[#ffffff88] group-hover:text-[#ffffff88]">
                      {event?.IsAllDay ? "True" : "False"}
                    </div>
                  </div>

                  {event?.Description && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-semibold">Description</div>
                      <p className="text-xs text-[#00000088] dark:text-[#ffffff88]">
                        {event?.Description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {/* <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Deactivate
              </button> */}
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
