import { useEffect, useRef } from "react";

type Props = {
  callback: () => void;
  excludedElements?: any[];
};

export const useOutsideClick = ({ callback, excludedElements }: Props) => {
  const ref = useRef<any>();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const isClickInsideExcluded = excludedElements?.some(
        (excludedElement) =>
          excludedElement.current &&
          excludedElement.current.contains(event.target),
      );

      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !isClickInsideExcluded
      ) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref, callback, excludedElements]);

  return ref;
};
