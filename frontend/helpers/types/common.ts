import { IconType } from "react-icons/lib";

export interface TApiResponse {
  success: boolean;
  message: string;
  code?: number;
}

export type ItemMenu = {
  icon?: IconType;
  title: string;
  url: string;
};

export type NavMenu = {
  title: string;
  url?: string;
  icon?: IconType;
  isActive?: boolean;
  items?: ItemMenu[];
};
