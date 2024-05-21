import { Avatar } from "@mui/material";
import * as React from "react";

const getHashOfString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line: no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};
const normalizeHash = (hash, min, max) => {
  return Math.floor((hash % (max - min)) + min);
};
const generateHSL = (name, saturationRange, lightnessRange) => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, 0, 360);
  const s = normalizeHash(hash, saturationRange[0], saturationRange[1]);
  const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1]);
  return [h, s, l];
};
const HSLtoString = (hsl) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};
const generateColorHsl = (id, saturationRange, lightnessRange) => {
  return HSLtoString(generateHSL(id, saturationRange, lightnessRange));
};
const getInitials = (user) => {
  return `${user.name.first[0]}${user.name.last[0]}`;
};
const setValue = (functionFor) => {
  return (e) => {
    const value = parseInt(e.target.value);
    functionFor(value);
  };
};
const getRange = (value, range) => {
  return [Math.max(0, value - range), Math.min(value + range, 100)];
};
const range = 10;
const saturation = 50;
const lightness = 50;
const saturationRange = getRange(saturation, range);
const lightnessRange = getRange(lightness, range);

export function OrgAvatar({ name }: { name: string }) {
  return (
    <Avatar
      sx={{
        width: 50,
        height: 50,
        bgcolor: generateColorHsl(name, saturationRange, lightnessRange),
      }}
      variant={"rounded"}
    >
      {name[0].toUpperCase()}
    </Avatar>
  );
}