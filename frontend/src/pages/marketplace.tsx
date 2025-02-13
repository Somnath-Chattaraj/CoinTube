import { useState } from "react"
// import Image from "next/image"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tokens } from "../lib/tokens"

export function Marketplace() {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("price")
  const [filterBy, setFilterBy] = useState("all")

  const filteredTokens = tokens
    .filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.creator.toLowerCase().includes(search.toLowerCase())
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "positive" && token.change > 0) ||
        (filterBy === "negative" && token.change < 0)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === "price") return b.price - a.price
      if (sortBy === "change") return b.change - a.change
      if (sortBy === "volume") return Number.parseFloat(b.volume) - Number.parseFloat(a.volume)
      return 0
    })

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens or creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tokens</SelectItem>
                <SelectItem value="positive">Positive Change</SelectItem>
                <SelectItem value="negative">Negative Change</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="change">24h Change</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTokens.map((token) => (
            <Card key={token.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-40 bg-muted">
                  <img 
                  src={token.image || "/placeholder.svg"} alt={token.name} className="object-contain h-full w-full"
                   />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{token.name}</h3>
                      <p className="text-sm text-muted-foreground">by {token.creator}</p>
                      <p className="text-sm text-muted-foreground">{token.subscribers} subscribers</p>
                    </div>
                    <Link to={"/coin/" + `${token.id}`}>
                    <Button variant="outline" size="sm">
                      Trade
                    </Button>
                    </Link>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">${token.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">24h Volume: ${token.volume}</p>
                    </div>
                    <p className={`text-sm font-medium ${token.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {token.change >= 0 ? "+" : ""}
                      {token.change}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

