import React from 'react';

import CheckBox from '../../components/checkbox';
import Card from '../../components/card';
import NavBar from '../../components/navbar';
export default function Home() {
  return (
    // className={styles.container}
    <div >
      <NavBar/>
      <CheckBox/>
      <Card/>
    </div>
  )
}