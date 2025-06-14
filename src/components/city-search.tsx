import  { useState } from 'react'
import { Button, buttonVariants } from './ui/button'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'
import { Loader2, Search } from 'lucide-react'
import { useLocationSearch } from '@/hooks/use-weather'

const CitySearch = () => {
    const [open ,setOpen] = useState(false)
    const [query , setQuery] =useState("")

   const {data :locations,isLoading} =  useLocationSearch(query)

   const handleSelect=()=>{

   }
   console.log(locations)
  return (
    <>
    <Button 
    variant={'outline'}
    className='relative w-full justify-start text-sm text-muted-foreground sm"pr-12 md:w-40 lg:w-64'
    onClick={()=>{
        setOpen(true)
    }}>
        <Search className='mr-2 h-4 w-4'/>
        Search cities...
    </Button>

     <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search cities" 
      value={query}
      onValueChange={setQuery}
      />
      <CommandList>
       {query.length >2 &&!isLoading && (<CommandEmpty>No results found.</CommandEmpty>)}
        <CommandGroup heading="Favorites">
          <CommandItem>Calendar</CommandItem>
        </CommandGroup>

        <CommandSeparator/>

         <CommandGroup heading="Recent Searches">
          <CommandItem>Calendar</CommandItem>
        </CommandGroup>

        <CommandSeparator/>

       {locations&&locations.length>0 &&( <CommandGroup heading="Suggestions">
        {isLoading && (
            <div className='flex items-center justify-center'>
                <Loader2 className='w-4 h-4 animate-spin'/>
            </div>
        )}

        {locations.map((location)=>{
            return <CommandItem key={`${location.lat} -${location.lon}`}
            value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
            onSelect={handleSelect}
            >
                <Search className='mr-2 w-4 h-4'/>
                <span>{location.name}</span>
                
            </CommandItem>
        })}
         
        </CommandGroup>
)}
      </CommandList>
    </CommandDialog>
    </>
  )
}

export default CitySearch