import { renderSocialCard, socialCardSize } from "./social-card";

export const alt = "SoyArtemio — Saco tu operación del caos";
export const size = socialCardSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return renderSocialCard();
}
