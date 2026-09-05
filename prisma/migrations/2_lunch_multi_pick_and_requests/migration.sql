-- AlterTable
ALTER TABLE "lunch_rounds" ADD COLUMN IF NOT EXISTS "second_winner_restaurant_id" INTEGER;
ALTER TABLE "lunch_rounds" ADD COLUMN IF NOT EXISTS "group_order_url" TEXT;

-- Drop old unique constraint and add new one for multi-pick
ALTER TABLE "lunch_nominations" DROP CONSTRAINT IF EXISTS "lunch_nominations_round_id_user_id_key";
ALTER TABLE "lunch_nominations" ADD CONSTRAINT "lunch_nominations_round_id_user_id_restaurant_id_key" UNIQUE ("round_id", "user_id", "restaurant_id");

-- CreateTable
CREATE TABLE "booking_requests" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lunch_saved_picks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lunch_saved_picks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_requests_booking_id_requester_id_key" ON "booking_requests"("booking_id", "requester_id");

-- CreateIndex
CREATE INDEX "idx_booking_requests_booking" ON "booking_requests"("booking_id");

-- CreateIndex
CREATE INDEX "idx_booking_requests_status" ON "booking_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "lunch_saved_picks_user_id_restaurant_id_key" ON "lunch_saved_picks"("user_id", "restaurant_id");

-- AddForeignKey
ALTER TABLE "lunch_rounds" ADD CONSTRAINT "lunch_rounds_second_winner_restaurant_id_fkey" FOREIGN KEY ("second_winner_restaurant_id") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lunch_saved_picks" ADD CONSTRAINT "lunch_saved_picks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lunch_saved_picks" ADD CONSTRAINT "lunch_saved_picks_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
