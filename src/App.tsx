import React, { useEffect, useState } from 'react';
import { DoubletDisplay } from './components/DoubletDisplay';
import { Doublet } from './types/Doublet';


const App: React.FC = () => {
    const [doublet, setDoublet] = useState<Doublet | null>(null);

    useEffect(() => {
        // fetch('/doublets/prophecy_of_isaac_birth.json')
        //     .then(res => res.json())
        //     .then(setDoublet);
        fetch('/doublets/water_from_rock_at_meribah.json')
            .then(res => res.json())
            .then(setDoublet);
    }, []);

    return (
        <div>
            <h1>Documentary Doublets</h1>
            {doublet ? <DoubletDisplay doublet={doublet} /> : <div>Loading...</div>}
        </div>
    );
};

export default App;