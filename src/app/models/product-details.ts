export class ProductDetails {

    productId!: Number;
    batchNumber!: string;
    productName!: string;
    productDescription!: string;
    productCategory!: Number;
    productImage!:string
    productPerPrice!: Number;
    productStripCount!: Number;
    productPerStripCount!:Number;
    productExpiryDate!: Date;
    createdDate!: Date;
    updatedDate!: Date;
    username!: string;
    userId!: Number;

    constructor(){}
}

export class MasterProductDetails {

    productId!: Number;
    productName!: string;
    productDescription!: string;
    productImage!:string;
    productCategory!: Number;
}

export class Category {
    name!:string;
    value!:Number;
}
