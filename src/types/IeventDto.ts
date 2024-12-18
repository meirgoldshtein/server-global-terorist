export interface eventDtoo  {
    eventid: number;
    iyear: number;
    imonth: number;
    iday: number;
    country_txt: string;
    region_txt: string;
    city: string;
    latitude: number;
    longitude: number;
    attacktype1_txt: string;
    targtype1_txt: string;
    target1: string;
    gname: string;
    weaptype1_txt: string;
    nkill: number | null;
    nwound: number | null;
    nperps: number | null;
    summary: string | null;
}


