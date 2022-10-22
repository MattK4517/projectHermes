import { useRouter } from "next/router";

export default function GodPage(){ 

    const router = useRouter()
    const { god } = router.query
    console.log(god)

    return <h1>{god}</h1>
}
