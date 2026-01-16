import styles from './menu.module.css';
import Link from "next/link";
import Image from "next/image";
import MenuPosts from '../menuposts/MenuPosts';
import MenuCategories from '../menucategories/MenuCategories';
import StarPosts from '../starposts/StarPosts';

const Menu = () => {
    return (
    <div className={styles.container}>
        <h2 className={styles.subtitle}>"What's hot?"</h2>
        <h1 className={styles.title}>热点内容</h1>
        <MenuPosts withImage={false}/>

        <h2 className={styles.subtitle}>Discover by Topic</h2>
        <h1 className={styles.title}>探索发现</h1>
        <MenuCategories/>

        <h2 className={styles.subtitle}>Chosen by the editor</h2>
        <h1 className={styles.title}>推荐文章</h1>
        <StarPosts withImage={true}/>

    </div>
    )
}

export default Menu