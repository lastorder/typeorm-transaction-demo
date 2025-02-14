import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class GiftRedeem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    gift_code_id: number

    @Column()
    user_id: number

    @Column()
    comments?: string

}
