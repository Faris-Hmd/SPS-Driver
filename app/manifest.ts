import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SPS Driver",
    short_name: "SPS",
    description: "SPS Driver",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      //   {
      //     src: "/favicon.ico",
      //     sizes: "512x512",
      //     type: "image/png",
      //   },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
