import connectDB from '../../../utils/connectDB'
import Categories from '../../../models/categoriseModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "PUT":
            await updateCategory(req, res)
            break;
        case "DELETE":
            await deleteCategory(req, res)
            break;
    }
}

const updateCategory = async (req, res)=> {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin')
        return res.status(400).json({err: "Authentication is not valid."})

        const {id} = req.query
        const {name} = req.body
        if(!name) return res.status(400).json({err: 'Name can not be left blank.'})

        const newCategory = await Categories.findOneAndUpdate({_id: id}, {name})
        res.json({
            msg: 'Success update a new category',
            newCategory: {
                ...newCategory._doc,
                name
            }
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

const deleteCategory = async (req, res)=> {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin')
        return res.status(400).json({err: "Authentication is not valid."})

        const {id} = req.query

        await Categories.findByIdAndDelete({_id: id})
        res.json({msg: 'Success deleted category'})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}