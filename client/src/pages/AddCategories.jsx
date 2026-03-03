import { useState, useEffect } from "react";
import {X, Tag} from "lucide-react";
import api from "../api/axios";

const AddCategories = ({isOpen, isClose, onSuccess}) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "expense",
    });

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            isClose();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await api.post("/categories", formData);
            onSuccess();
            isClose();
            setFormData({...formData, name: ""});
        }catch(err){
            alert("Failed to add category");
        }
    }

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={handleOverlayClick}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-grey-100 flex justify-between items-center bg-grey-50/50 ">
                    <div className="flex items-center gap-2">
                        <Tag size={20} className="text-blue-500"/>
                        <h2 className="text-xl font-bold text-grey-800">Add Category</h2>
                    </div>
                    <button className="p-2 text-grey-400 hover:text-red-500 hover:bg-red-50 rounded-full transition" onClick={isClose}>
                        <X size={20}/>
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex bg-grey-100 p-1 rounded-xl">
                            {["expense", "income"].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type})}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${ formData.type === type ? type === "income" ? "bg-green-500 text-white shadow-md" : "bg-red-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700 " }`}
                                >{type}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"> Category Name</label>
                            <input type="text" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue 500 focus:bg-white transition outline-none" placeholder="e.g. Groceries, Salary, Rent" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg mt-2">
                            Create Category
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddCategories;