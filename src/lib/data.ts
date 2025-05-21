import CSK from "@/assets/teams/csk.webp"
import DC from "@/assets/teams/dc.webp"
import GT from "@/assets/teams/gt.webp"
import KKR from "@/assets/teams/kkr.webp"
import LSG from "@/assets/teams/lsg.webp"
import MI from "@/assets/teams/mi.webp"
import PBKS from "@/assets/teams/pbks.webp"
import RR from "@/assets/teams/rr.webp"
import RCB from "@/assets/teams/rcb.webp"
import SRH from "@/assets/teams/srh.webp"
import { Team } from "./types"

export const teams: Team[] = [
    {
        name: "Chennai Super Kings",
        logo: CSK,
        color: "#FF0000",
        slug:"csk",
    },
    {
        name: "Delhi Capitals",
        logo: DC,
        color: "#FF0000",
        slug:"dc",
    },
    {
        name: "Gujarat Titans",
        logo: GT,
        color: "#FF0000",
        slug:"gt",
    },
    {
        name: "Kolkata Knight Riders",
        logo: KKR,
        color: "#FF0000",
        slug:"kkr",
    },
    {
        name: "Lucknow Super Giants",
        logo: LSG,
        color: "#FF0000",
        slug:"lsg",
    },
    {
        name: "Mumbai Indians",
        logo: MI,
        color: "#FF0000",
        slug:"mi",
    },
    {
        name: "Punjab Kings",
        logo: PBKS,
        color: "#FF0000",
        slug:"pbks",
    },
    {
        name: "Rajasthan Royals",
        logo: RR,
        color: "#FF0000"    ,
        slug:"rr",
    },
    {
        name: "Royal Challengers Bengaluru",
        logo: RCB,
        color: "#FF0000",
        slug:"rcb",
    },
    {
        name: "Sunrisers Hyderabad",
        logo: SRH,
        color: "#FF0000",
        slug:"srh",
    }
]