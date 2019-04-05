var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Order = require('../../models/order');
var Product = require('../../models/product');

router.get('/',(req,res,next)=>{
    Order.find().select('product _id quantity').exec().then((docs)=>{
        var response = {
            coutn: docs.length,
            order:docs.map((doc)=>{
                return{
                    product:doc.product,
                    quantity:doc.quantity,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:"localhost:3000/order/"+ doc._id 
                    }
                }

            })
        }
        res.json(response);
    }).catch((err)=>{
        res.status(500).json({
            error:err
        })
    })
});
router.post('/',(req,res,next)=>{
    Product.findById({_id:req.body.productId}).exec().then((doc)=>{
        const order=new Order({
            _id: mongoose.Types.ObjectId(),
            product : req.body.productId,
            quantity : req.body.quantity
        });
        order.save().then((result)=>{
            res.json({
                message:"Order placed",
                createdOrder:{
                    _id: result._id,
                    product:result.product,
                    quantity:result.quantity
                },
                request:{
                    type:"GET",
                    url:"localhost:3000/order/"+result._id
                }
            });
        }).catch((err)=>{
            res.status(201).json({
                message:'Product not found',
                error:err
            });
        });
    }).catch((err)=>{
        res.status('400').json({
            error:err
        });
    });
});
router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:'Order details',
        orderId:req.params.orderId
    });
});
router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:'order Deleted'
    });
});
module.exports = router;