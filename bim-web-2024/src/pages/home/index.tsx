import { Button } from "flowbite-react"

const Home = () => {
    return (
        <div className="relative h-full w-full flex justify-center items-center">
            <div>
                <h1 className="text-5xl text-green-500">Welcome my BIM platform</h1>
                <Button color="blue" href="/project">
                    Get start to explore
                </Button>
            </div>
        </div>
    )
}
export default Home;