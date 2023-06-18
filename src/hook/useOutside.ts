import {useEffect} from "react";

export function useOutsideAlerter(ref: any, closeFunc: () => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if ((ref.current) && !ref.current.contains(event.target)) {
                closeFunc()
            }
        }
        // Bind the event listener
        document.addEventListener("click", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickOutside);
        };
    }, [ref]);
}