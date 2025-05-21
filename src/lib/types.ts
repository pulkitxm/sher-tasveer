import { StaticImageData } from "next/image";

export type Team = {
  name: string;
  logo: StaticImageData;
  color: string;
  slug: string;
  placeholderImage: StaticImageData;
};
