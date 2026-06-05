import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout/index.js";
import Dashboard from "@/pages/Dashboard/index.js";
import Workshop from "@/pages/Workshop/index.js";
import Crafting from "@/pages/Crafting/index.js";
import Enchanting from "@/pages/Enchanting/index.js";
import Market from "@/pages/Market/index.js";
import Arena from "@/pages/Arena/index.js";
import Guild from "@/pages/Guild/index.js";
import Ranking from "@/pages/Ranking/index.js";
import WorkshopBrowse from "@/pages/WorkshopBrowse/index.js";
import Inventory from "@/pages/Inventory/index.js";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/crafting" element={<Crafting />} />
          <Route path="/enchanting" element={<Enchanting />} />
          <Route path="/market" element={<Market />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/guild" element={<Guild />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/browse" element={<WorkshopBrowse />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/quests" element={<div className="text-center text-xl py-20 text-gray-400">任务系统 - 开发中...</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
