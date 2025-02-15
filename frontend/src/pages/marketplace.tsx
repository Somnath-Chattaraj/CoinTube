import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { BACKEND_URL } from "@/config";

interface Token {
  tokenId: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  tokenPrice: number;
  walletAddress: string;
  Seller_name: string;
  email: string;
  amount: number;
}

export function Marketplace() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [filterBy, setFilterBy] = useState("all");
  const [loading, setLoading] = useState(false);
  const [tokenList, setTokenList] = useState<Token[]>([]);

  const fetchTokenList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/token/listedToken`,{
        withCredentials: true,
      });
      // @ts-ignore
      setTokenList(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenList();
  }, []);

  const filteredTokens = tokenList
    .filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.Seller_name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "positive" && token.tokenPrice > 0) ||
        (filterBy === "negative" && token.tokenPrice < 0);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "price") return b.tokenPrice - a.tokenPrice;
      return 0;
    });

  if (loading) {
    return (
      <main className="container mx-auto py-6 px-4">
        <p>Loading...</p>
      </main>
    );
  }

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
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTokens.map((token) => (
            <Card key={token.tokenId} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-40 bg-muted">
                  <img
                    src={token.tokenAddress || "/placeholder.svg"}
                    alt={token.name}
                    className="object-contain h-full w-full"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{token.name}</h3>
                      <p className="text-sm text-muted-foreground">by {token.Seller_name}</p>
                      <p className="text-sm text-muted-foreground">{token.email}</p>
                    </div>
                    <Link to={"/coin/" + `${token.tokenAddress}`}>
                      <Button variant="outline" size="sm">
                        Trade
                      </Button>
                    </Link>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">${token.tokenPrice.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Amount: {token.amount}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}