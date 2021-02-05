import React from 'react';

import CheckBox from '../../components/custom/profile_demo';
import Card from '../../components/typing/card';
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