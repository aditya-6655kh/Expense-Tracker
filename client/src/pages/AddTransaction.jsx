import { useState, useEffect } from "react";
import {X} from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddTransaction = ({isOpen, isClose, onSuccess, transactionToEdit}) => {
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        category_id: "",
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();  

    useEffect(() => {
        if(isOpen){
          api.get("/categories").then((res) => {setCategories(res.data)});

          if(transactionToEdit) {
            setFormData({
              amount: transactionToEdit.amount,
              description: transactionToEdit.description,
              type: transactionToEdit.type,
              date: new Date(transactionToEdit.date).toISOString().split("T")[0],
              category_id: transactionToEdit.category_id,
            });
          }else{
            setFormData({
              amount: "",
              description: "",
              type: "expense",
              date: new Date().toISOString().split("T")[0],
              category_id: "",
            });
          }
        }
    }, [isOpen, transactionToEdit]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
          isClose();
        }
    }

    const handleChange = async (e) => {
        e.preventDefault();

        try{
          if(transactionToEdit){
            await api.put(`/transactions/${transactionToEdit.transaction_id}`, formData);
          }else{
            await api.post("/transactions", formData);
          }
          onSuccess();
          isClose();
          setFormData({...formData, amount: "", description: "", category_id: ""});
        }catch(err){
            alert("Failed to add transaction");
        }
    }

    if(!isOpen) return null;

    return (
    /* THE BACKGROUND OVERLAY
      - bg-black/40: Semi-transparent black
      - backdrop-blur-md: This creates the heavy blur effect on the dashboard behind it
      - z-50: Ensures it sits on top of everything else
    */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* THE FORM CONTAINER
        - scale-in animation makes it pop up smoothly
      */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">New Transaction</h2>
          <button 
            onClick={isClose} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleChange} className="space-y-5">
            
            {/* Type Toggle (Income / Expense) */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {["expense", "income"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                    formData.type === type
                      ? type === "income" 
                        ? "bg-green-500 text-white shadow-md" 
                        : "bg-red-500 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Amount & Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-medium">₹</span>
                  <input
                    type="number"
                    required
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
              <select
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none appearance-none"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">Select a category...</option>
                {categories
                  .filter((c) => c.type === formData.type)
                  .map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition outline-none"
                placeholder="What was this for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition shadow-lg mt-2"
            >
              Save Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;