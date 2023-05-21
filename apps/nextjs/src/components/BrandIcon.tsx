import Image from "next/image";
import { useColorModeValue } from "@chakra-ui/react";

import cat2 from "../../public/cat2.svg";

export const BrandIcon = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const imgFilter = useColorModeValue("invert(20%)", "invert(85%)");
  const width = size === "sm" ? 24 : size === "md" ? 32 : 42;
  return (
    <Image
      src={cat2}
      alt="cute cat logo"
      width={width}
      style={{ filter: imgFilter }}
    />
  );
};
