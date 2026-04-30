/*
  Warnings:

  - You are about to alter the column `total_amount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(65,30)`.
  - Made the column `user_id` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `book_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_id` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order_items` MODIFY `order_id` INTEGER NOT NULL,
    MODIFY `book_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `total_amount` DECIMAL(65, 30) NULL DEFAULT 0.00,
    MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `payments` MODIFY `order_id` INTEGER NOT NULL,
    MODIFY `amount` DECIMAL(65, 30) NOT NULL,
    MODIFY `payment_date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`address_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `addresses` RENAME INDEX `user_id` TO `addresses_user_id_idx`;

-- RenameIndex
ALTER TABLE `order_items` RENAME INDEX `book_id` TO `order_items_book_id_idx`;

-- RenameIndex
ALTER TABLE `order_items` RENAME INDEX `order_id` TO `order_items_order_id_idx`;

-- RenameIndex
ALTER TABLE `orders` RENAME INDEX `address_id` TO `orders_address_id_idx`;

-- RenameIndex
ALTER TABLE `orders` RENAME INDEX `user_id` TO `orders_user_id_idx`;

-- RenameIndex
ALTER TABLE `payments` RENAME INDEX `order_id` TO `payments_order_id_idx`;
