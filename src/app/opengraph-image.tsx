import { renderSocialCard, socialCardSize } from "./social-card";

export const alt = "SoyArtemio — Deja de usar la IA como un juguete";
export const size = socialCardSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSocialCard();
}
