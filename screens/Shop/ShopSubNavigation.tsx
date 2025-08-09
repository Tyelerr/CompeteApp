import ContentSwitcher from "../../components/ContentSwitcher";

export default function ShopSubNavigation(){
  return <ContentSwitcher buttonsDetails={[
    {
      title: 'Shop Home',
      route: 'ShopHome',
      icon: 'bag-check'
    },
    {
      title: 'Rewards',
      route: 'ShopRewards',
      icon: 'gift'
    },
    /*{
      title: 'Featured Bar',
      route: 'HomeFeaturedBar',
      icon: 'bar-chart'
    }*/
  ]} />
}