import { publicProcedure, router } from "../trpc";

export const godPageRouter = router({
  godWinRate: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.achilles.aggregate({
      where: {
        player: { contains: "LordKarnox" },
      },
    });
  }),
});
