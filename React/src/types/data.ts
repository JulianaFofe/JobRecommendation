

export interface NavBarProps {
    id:number
    title:string
    path:string
}

export const NavProps:NavBarProps[]=[
    {
        id:1,
        title:"Welcome",
        path:"/"
    },
    {
        id:2,
        title:"How It Works?",
        path:"/works"
    },
    {
        id:3,
        title:"Customer Stories",
        path:"/stories"
    },
]