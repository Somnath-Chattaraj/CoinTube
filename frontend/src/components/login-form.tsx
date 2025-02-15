import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWriteContract } from "wagmi";
import { tokenFactor_abi } from "@/lib/tokenFactor_abi";
import { Abi } from "viem";
import { TOKEN_CONTRACT_ADDRESS } from "@/config";

// Define the Zod schema
const formSchema = z.object({
  token: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  init: z
    .string()
    .min(1, "Initial supply is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Initial supply must be a number",
    }),
  fee: z
    .string()
    .min(1, "Royalty fee is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Royalty fee must be a number",
    })
    .refine((val) => Number(val) <= 10, {
      message: "Royalty fee must not exceed 10",
    }),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate on change
  });

  // ✅ Move useWriteContract outside onSubmit
  const { writeContractAsync } = useWriteContract();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    try {
      const txHash = await writeContractAsync({
        address: TOKEN_CONTRACT_ADDRESS as `0x${string}`,
        abi: tokenFactor_abi as Abi,
        functionName: "createYouTubeToken",
        args: [data.token, data.symbol, Number(data.init), Number(data.fee)],
      });
      console.log("Transaction Sent:", txHash);
    } catch (error) {
      console.error("Error minting token:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mint Token</CardTitle>
          <CardDescription>Enter Token name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="ChannelCoin"
                  {...register("token")}
                />
                {errors.token && <span className="text-red-500">{errors.token.message}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  type="text"
                  placeholder="SOL"
                  {...register("symbol")}
                />
                {errors.symbol && <span className="text-red-500">{errors.symbol.message}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="init">Initial Supply</Label>
                <Input
                  id="init"
                  type="text"
                  placeholder="1000"
                  {...register("init")}
                />
                {errors.init && <span className="text-red-500">{errors.init.message}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fee">Royalty Fee</Label>
                <Input
                  id="fee"
                  type="text"
                  placeholder="$10"
                  {...register("fee")}
                />
                {errors.fee && <span className="text-red-500">{errors.fee.message}</span>}
              </div>

              <Button type="submit" className="w-full" disabled={!isValid}>
                Mint Token
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
