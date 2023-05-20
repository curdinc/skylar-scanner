import { chakra, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp, motion } from "framer-motion";

export const MotionText = chakra(motion.p, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});
