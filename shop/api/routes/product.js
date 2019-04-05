var express = require('express');
var router = express.Router();
var Product = require('../../models/product');
var mongoose = require('mongoose');
router.get('/',(req,res,next)=>{
    Product.find().select("name price _id").exec().then((docs)=>{
        var response={
            count :docs.length,
            product:docs.map((doc)=>{
                return{
                    name:doc.name,
                    price :doc.price,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:"localhost:3000/product/"+ doc._id 
                    }
                }
            })
        }
        res.json(response);
    }
    ).catch((err)=>{
        console.log(err);
        res.status(400).json({
            error:err
        });
    })
});
router.post('/',(req,res,next)=>{
    const product = new Product({
        _id : mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    });
    product.save().then((result)=>{
        res.json({
            result:result
        })
    }).catch((err)=>{
        res.status(500).json({
            error:err
        })
    });
    
});
router.get('/:productId',(req,res,next)=>{
    var id = req.params.productId;
    Product.findById(id).exec().then((doc)=>{
        console.log(doc);
        res.status(200).json({
            product:doc,
            request:{
                type:"GET",
                url:'localhost:3000/product'+doc._id
            }
        });
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({error:err})
    })
});
router.patch('/:productId',(req,res,next)=>{
    var id = req.params.productId;
    var updateOps ={}
    for(var ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.update({_id:id},{$set:updateOps}).exec().then((result)=>{
        res.status(200).json({
            message:'Product Updated',
            product:result,
            request:{
                type:"GET",
                url:'localhost:3000/product/'+result._id
            }
        });
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});
router.delete('/:productId',(req,res,next)=>{
    var id = req.params.productId;
    Product.remove({_id:id}).exec().then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({
            error:err
        })
    })
});
module.exports = router;