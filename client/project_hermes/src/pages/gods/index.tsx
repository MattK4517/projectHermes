import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import Link from 'next/link'

interface god {
  name: string,
  url: string
}

export default function GodsList(props) {
    console.log(props.dehydratedState)
  

    const { data, isLoading } = useQuery<god[]>(['posts'], getPosts);

    console.log(data, isLoading)

    if (isLoading) return <h1>Loading...</h1>

    return (
      <div className="card grid autofill-columns gap-3 p-5">
      {Object.values(data).map((god: god, index) => {
        return (
          <Link
          key={index}
          href={"/gods/".concat(god.name)}
          target="_blank"
          >
            <div className="h-fit w-fit flex flex-col items-center">
              {/* <figure className="relative overflow-hidden border-slate-600"> */}
                <img
                  className='bg-neutral-900'
                  src={god.url}
                  alt={god.name}
                />
                {/* <figcaption>
                  <p>Stats for {god.name}</p>
                </figcaption>
              </figure> */}
              <div className="w-fit">{god.name}</div>
            </div>
          </Link>
        );
      })}
    </div>
    )
}


export async function getStaticProps() {
    const queryClient = new QueryClient()
  
    await queryClient.prefetchQuery(['posts'], getPosts)


  
    return {    
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
      },
    }
  }
  
  
  function Posts() {
    // This useQuery could just as well happen in some deeper child to
    // the "Posts"-page, data will be available immediately either way
    const { data } = useQuery(['gods'], getPosts)
  
    // This query was not prefetched on the server and will not start
    // fetching until on the client, both patterns are fine to mix
    const { data: otherData } = useQuery(['gods-2'], getPosts)
  
    // ...
  }

 async function getPosts() {
    return (await fetch("http://localhost:5000/api/gods")).json()
  }