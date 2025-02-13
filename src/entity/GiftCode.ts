import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class GiftCode {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    status: string

}
