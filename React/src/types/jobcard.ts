// export interface NavbarTab {
//   id: string;
//   label: string;
//   href?: string;
// }

export interface JobCard {
  id: string;
  title: string;
  blurb?: string;
  ctaText: string; // e.g. "Apply"
  description:string;
  salary:string;
  location:string;
  status:string
}
