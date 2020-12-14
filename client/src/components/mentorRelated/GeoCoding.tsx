import axios from 'axios'

function GeoCoding(obj: any) : any {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${obj.address.split(' ').join()}&key=${process.env.REACT_APP_API_KEY}`)
        .then((x) => {
            return obj.geo = x.data.results[0].geometry.location
        })
        .catch(e => console.log(e)) 
}

export function pairing (s: any[], m: any[]) {
    const geoS = s.map((student: any[]) => GeoCoding(student))
    const geoM = m.map((mentor: any[]) => GeoCoding(mentor))
    geoS.sort((a, b) => a.geo.lat - b.geo.lat)
    geoM.sort((a, b) => a.geo.lat - b.geo.lat)
}