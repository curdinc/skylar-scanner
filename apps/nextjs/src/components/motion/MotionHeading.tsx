import { chakra, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp, motion } from "framer-motion";

export const MotionHeading = chakra(motion.h2, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});
